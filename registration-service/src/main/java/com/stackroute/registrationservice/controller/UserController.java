package com.stackroute.registrationservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackroute.registrationservice.domain.Post;
import com.stackroute.registrationservice.domain.User;
import com.stackroute.registrationservice.domain.UserDAO;
import com.stackroute.registrationservice.domain.UserDTO;
import com.stackroute.registrationservice.exception.UserAlreadyExistsException;
import com.stackroute.registrationservice.exception.UserNotFoundException;
import com.stackroute.registrationservice.service.StripeClient;
import com.stackroute.registrationservice.service.UserRegistrationService;
import com.stripe.model.Charge;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;


@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping(value = "api/v1")
public class UserController {

    UserRegistrationService userRegistrationService;
    private final RabbitTemplate rabbitTemplate;

    private PasswordEncoder bcryptEncoder = new BCryptPasswordEncoder(12);

    private Queue queue;

    private StripeClient stripeClient;

    static final String queueName="user";
    static final String topicExchangeName="user-auth";
    static final String routingKey = "user.auth.reg";
    static final String neo4jRoutingKey = "user.reg.rec";

    @Autowired
    public UserController(UserRegistrationService userRegistrationService, RabbitTemplate rabbitTemplate, Queue queue, StripeClient stripeClient) {
        this.userRegistrationService=userRegistrationService;
        this.rabbitTemplate = rabbitTemplate;
        this.stripeClient = stripeClient;
        this.queue = new Queue(queueName, false);
        BindingBuilder.bind(queue)
                .to(new TopicExchange(topicExchangeName))
                .with("user.auth.#");
    }

    @PostMapping("register")
    public ResponseEntity<?> saveUser(@RequestBody UserDAO userDao) {
        if(userDao.getIsSub() == null) {
            userDao.setIsSub(false);
        }
        List<Post> post = new ArrayList<Post>();
        User user = User.builder()
                        .name(userDao.getName())
                        .dateOfBirth(userDao.getDateOfBirth())
                        .email(userDao.getEmail())
                        .username(userDao.getUsername())
                        .newsPreferences(userDao.getNewsPreferences())
                        .posts(post)
                        .liked(post)
                        .flagged(post)
                        .watched(post)
                        .bought(post)
                        .isSub(userDao.getIsSub())
                        .build();
        ResponseEntity responseEntity;

        try{
            User savedUser = userRegistrationService.saveUser(user);
            UserDTO userDTO = new UserDTO(user.getUsername(), bcryptEncoder.encode(userDao.getPassword()));
            rabbitTemplate.convertAndSend(topicExchangeName, routingKey, new ObjectMapper().writeValueAsString(userDTO));
            rabbitTemplate.convertAndSend(topicExchangeName, neo4jRoutingKey, new ObjectMapper().writeValueAsString(userDao));
            responseEntity = new ResponseEntity<User>( savedUser,HttpStatus.CREATED);
        } catch (UserAlreadyExistsException e) {
            responseEntity = new ResponseEntity<String>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (JsonProcessingException e) {
            responseEntity = new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return responseEntity;
    }

    @GetMapping("register/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username) {
        ResponseEntity responseEntity;
        try {
            responseEntity = new ResponseEntity<User>(userRegistrationService.getUser(username), HttpStatus.OK);
        } catch (UserNotFoundException e) {
            responseEntity = new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        return responseEntity;
    }

    @PutMapping("register/{username}")
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        ResponseEntity responseEntity;
        try {
            responseEntity = new ResponseEntity<User>(userRegistrationService.updateUser(user), HttpStatus.OK);
            UserDAO userDAO = UserDAO.builder()
                    .dateOfBirth(user.getDateOfBirth())
                    .email(user.getEmail())
                    .isSub(user.getIsSub())
                    .name(user.getName())
                    .newsPreferences(user.getNewsPreferences())
                    .password("")
                    .username(user.getUsername())
                    .build();
            rabbitTemplate.convertAndSend(topicExchangeName, neo4jRoutingKey, new ObjectMapper().writeValueAsString(userDAO));
        } catch (UserNotFoundException | NullPointerException | JsonProcessingException e) {
            responseEntity = new ResponseEntity<String>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        return responseEntity;
    }

    @PostMapping("/charge")
    public ResponseEntity<?> chargeCard(HttpServletRequest request, @RequestBody UserDAO userDao) throws Exception {
        String token = request.getHeader("token");
        Double amount = Double.parseDouble(request.getHeader("amount"));
        boolean status =  this.stripeClient.chargeCreditCard(token, amount);
        if(!status) {
            return new ResponseEntity<String>("Payment failed", HttpStatus.BAD_REQUEST);
        }
        userDao.setIsSub(true);
        List<Post> post = new ArrayList<Post>();
        User user = User.builder()
                .name(userDao.getName())
                .dateOfBirth(userDao.getDateOfBirth())
                .email(userDao.getEmail())
                .username(userDao.getUsername())
                .newsPreferences(userDao.getNewsPreferences())
                .posts(post)
                .liked(post)
                .flagged(post)
                .watched(post)
                .bought(post)
                .isSub(userDao.getIsSub())
                .build();
        ResponseEntity responseEntity;

        try{
            User savedUser = userRegistrationService.saveUser(user);
            UserDTO userDTO = new UserDTO(user.getUsername(), bcryptEncoder.encode(userDao.getPassword()));
            rabbitTemplate.convertAndSend(topicExchangeName, routingKey, new ObjectMapper().writeValueAsString(userDTO));
            rabbitTemplate.convertAndSend(topicExchangeName, neo4jRoutingKey, new ObjectMapper().writeValueAsString(userDao));
            responseEntity = new ResponseEntity<User>( savedUser,HttpStatus.CREATED);
        } catch (UserAlreadyExistsException e) {
            responseEntity = new ResponseEntity<String>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (JsonProcessingException e) {
            responseEntity = new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return responseEntity;

    }
}
