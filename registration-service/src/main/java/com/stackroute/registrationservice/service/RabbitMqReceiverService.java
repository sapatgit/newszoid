package com.stackroute.registrationservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackroute.registrationservice.domain.Post;
import com.stackroute.registrationservice.domain.PostDTO;
import com.stackroute.registrationservice.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class RabbitMqReceiverService {

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
                    .tags(postDTO.getTags())
                    .timestamp(postDTO.getTimestamp())
                    .category(postDTO.getCategory())
                    .build();
            User user = userRegistrationService.getUser(postDTO.getPostedBy().getUsername());
            if(user.getPosts()!=null) {
                Iterator itr = user.getPosts().iterator();
                while(itr.hasNext()) {
                    Post postFind = (Post) itr.next();
                    if(postFind.getId().equals(post.getId())) {
                        System.out.printf("found!");
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
                                    System.out.printf("found!");
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
                            Iterator itr = user.getLiked().iterator();
                            while(itr.hasNext()) {
                                Post postFind = (Post) itr.next();
                                if(postFind.getId().equals(post.getId())) {
                                    System.out.printf("found!");
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
                            Iterator itr = user.getLiked().iterator();
                            while(itr.hasNext()) {
                                Post postFind = (Post) itr.next();
                                if(postFind.getId().equals(post.getId())) {
                                    System.out.printf("found!");
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
            e.printStackTrace();
        }
    }
}
