package com.stackroute.recommendationservice.services;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import com.stackroute.recommendationservice.domain.Post;
import com.stackroute.recommendationservice.domain.User;
import com.stackroute.recommendationservice.repositories.NewsRepository;
import com.stackroute.recommendationservice.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RecommendationService {

    private final static Logger LOG = LoggerFactory.getLogger(RecommendationService.class);

	private final NewsRepository newsRepository;
	private final UserRepository userRepository;
	public RecommendationService(NewsRepository newsRepository, UserRepository userRepository) {
		this.newsRepository = newsRepository;
		this.userRepository = userRepository;
	}


	//@Transactional(readOnly = true)
	@Transactional
	public Collection<Post> recommend(String username) throws ExecutionException, InterruptedException {
		//return newsRepository.recommend(userId);
		CompletableFuture<Collection<Post>> task1 = CompletableFuture.supplyAsync(()-> mostViewedCategory(username));
		CompletableFuture<Collection<Post>> task2 = CompletableFuture.supplyAsync(()-> mostLikedCategory(username));
		//CompletableFuture<Collection<Post>> task3 = CompletableFuture.supplyAsync(()-> byProfile(username));
		CompletableFuture<Void> allOf = CompletableFuture.allOf(task1, task2);
		allOf.get();
		Collection<Post> result = task1.get();
		if (result == null) {
			task2.get();
		} else {
			result.addAll(task2.get());
		}
		/*if (result == null) {
			task3.get();
		} else {
			result.addAll(task3.get());
		}*/
		return result;
	}

    @Transactional(readOnly = true)
    public Post findByTitle(String title) {
		return newsRepository.findByTitle(title);
    }

	@Transactional(readOnly = true)
	public User findByUserName(String username) {
		return userRepository.findByUsername(username);
	}

    @Transactional(readOnly = true)
    public Collection<Post> findByTitleLike(String title) {
		return newsRepository.findByTitleLike(title);
    }

	@Transactional(readOnly = true)
	public Collection<Post> mostViewedCategory(String userName) {
//		try {
//			Thread.sleep(5000);
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		}
		return newsRepository.mostViewedCategory(userName);
	}

	@Transactional(readOnly = true)
	public Collection<Post> mostLikedCategory(String userName) {
//		try {
//			Thread.sleep(5000);
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		}
		return newsRepository.mostLikedCategory(userName);
	}

	@Transactional(readOnly = true)
	public Collection<Post> byProfile(String userName) {
//		try {
//			Thread.sleep(5000);
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		}
		return newsRepository.byProfile(userName);
	}

	@Transactional(readOnly = true)
	public Collection<Post> byAgeGroup(String userName) {
		return newsRepository.byAgeRange(userName);
	}

	@Transactional(readOnly = true)
	public Collection<Post> byPreferences(String userName) {
		return newsRepository.byPreferences(userName);
	}
}
