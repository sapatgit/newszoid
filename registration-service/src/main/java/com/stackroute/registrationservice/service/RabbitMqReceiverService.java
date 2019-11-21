package com.stackroute.registrationservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackroute.registrationservice.domain.Post;
import com.stackroute.registrationservice.domain.PostDTO;
import com.stackroute.registrationservice.domain.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class RabbitMqReceiverService {
    private static final Logger logger = LoggerFactory.getLogger(RabbitMqReceiverService.class);


    @Autowired
    private UserRegistrationService userRegistrationService;

    public void receiveMessage(String message) {
        PostDTO postDTO;
        try {
            postDTO = new ObjectMapper().readValue(message, PostDTO.class);
            Post post = Post.builder()
                    .id(postDTO.getId())
                    .title(postDTO.getTitle())
                    .videoUrl(postDTO.getVideoUrl())
                    .location(postDTO.getLocation())
                    .fullLocation(postDTO.getFullLocation())
                    .tags(postDTO.getTags())
                    .timestamp(postDTO.getTimestamp())
                    .category(postDTO.getCategory())
                    .build();
            User user = userRegistrationService.getUser(postDTO.getPostedBy());
            if(user.getPosts()!=null) {
                Iterator itr = user.getPosts().iterator();
                while(itr.hasNext()) {
                    Post postFind = (Post) itr.next();
                    if(postFind.getId().equals(post.getId())) {
                        itr.remove();
                    }
                }
                user.getPosts().add(post);
            } else {
                List<Post> posts = new ArrayList<Post>();
                posts.add(post);
                user.setPosts(posts);
            }
            if(postDTO.getLikedBy() != null) {
                for (String userFind : postDTO.getLikedBy()) {
                    if (user.getUsername().equals(userFind)) {
                        if (user.getLiked() != null) {
                            Iterator itr = user.getLiked().iterator();
                            while(itr.hasNext()) {
                                Post postFind = (Post) itr.next();
                                if(postFind.getId().equals(post.getId())) {
                                    itr.remove();
                                }
                            }
                            user.getLiked().add(post);
                        } else {
                            List<Post> posts = new ArrayList<Post>();
                            posts.add(post);
                            user.setLiked(posts);
                        }
                    }
                }
            }
            if(postDTO.getWatchedBy() != null) {
                for (String userFind : postDTO.getWatchedBy()) {
                    if (user.getUsername().equals(userFind)) {
                        if (user.getWatched() != null) {
                            Iterator itr = user.getWatched().iterator();
                            while(itr.hasNext()) {
                                Post postFind = (Post) itr.next();
                                if(postFind.getId().equals(post.getId())) {
                                    itr.remove();
                                }
                            }
                            user.getWatched().add(post);
                        } else {
                            List<Post> posts = new ArrayList<Post>();
                            posts.add(post);
                            user.setWatched(posts);
                        }
                    }
                }
            }
            if(postDTO.getFlaggedBy() != null) {
                for (String userFind : postDTO.getFlaggedBy()) {
                    if (user.getUsername().equals(userFind)) {
                        if (user.getFlagged() != null) {
                            Iterator itr = user.getFlagged().iterator();
                            while(itr.hasNext()) {
                                Post postFind = (Post) itr.next();
                                if(postFind.getId().equals(post.getId())) {
                                    itr.remove();
                                }
                            }
                            user.getFlagged().add(post);
                        } else {
                            List<Post> posts = new ArrayList<Post>();
                            posts.add(post);
                            user.setFlagged(posts);
                        }
                    }
                }
            }
            userRegistrationService.updateUser(user);
        } catch (Exception e) {
            //e.printStackTrace();
            logger.error("Exception in RabbitMqReceiverService.receiveMessage()");
        }
    }
}
