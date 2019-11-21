package com.stackroute.recommendationservice.services;

import com.stackroute.recommendationservice.domain.AgeGroup;
import com.stackroute.recommendationservice.domain.Post;
import com.stackroute.recommendationservice.domain.User;
import com.stackroute.recommendationservice.repositories.NewsRepository;
import com.stackroute.recommendationservice.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Service
public class QueryService {
    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    public QueryService(NewsRepository newsRepository, UserRepository userRepository) {
        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
    }


    @Transactional
    public User getUser(String userName) {
        return userRepository.findByUsername(userName);
    }

    @Transactional
    public void saveUser(User user) {
        userRepository.save(user);
    }

    @Transactional
    public void addToViewed(String username, Long videoId){
        User user = getUser(username);
        Set<Post> viewed = user.getViewedPosts();
        if(viewed == null) {
            viewed = new HashSet<>();
        }
        AgeGroup ageGroup = user.getAgeGroup();
        if(ageGroup != null) {
            newsRepository.createViewedByAgeRel(videoId, ageGroup.getAgeGroup(), username);
        }
        Post post = newsRepository.findById(videoId).orElse(null);
        viewed.add(post);
        user.setViewedPosts(viewed);
        userRepository.save(user);
    }

    @Transactional
    public void addToLiked(String username, Long videoId){
        User user = getUser(username);
        Set<Post> liked = user.getLikedPosts();
        if(liked == null) {
            liked = new HashSet<>();
        }
        Post post = newsRepository.findById(videoId).orElse(null);
        liked.add(post);
        user.setLikedPosts(liked);
        userRepository.save(user);
    }

    @Transactional
    public void addToBought(String username, Long videoId){
        User user = getUser(username);
        Set<Post> bought = user.getBoughtPosts();
        if(bought == null) {
            bought = new HashSet<>();
        }
        Post post = newsRepository.findById(videoId).orElse(null);
        bought.add(post);
        user.setBoughtPosts(bought);
        userRepository.save(user);
    }

    @Transactional
    public void removeFromLiked(Long videoId) {
        newsRepository.deleteLikedRel(videoId);
    }

    @Transactional
    public void removeAgeGroupRel(String userName) {
        userRepository.deleteAgeGroupRel(userName);
    }

    @Transactional
    public void removeNewsPrefRel(String userName) {
        userRepository.deleteNewsPrefRel(userName);
    }
}
