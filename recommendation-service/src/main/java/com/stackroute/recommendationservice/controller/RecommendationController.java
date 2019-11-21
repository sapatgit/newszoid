package com.stackroute.recommendationservice.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.stackroute.recommendationservice.domain.Post;
import com.stackroute.recommendationservice.domain.PostResp;
import com.stackroute.recommendationservice.domain.User;
import com.stackroute.recommendationservice.services.QueryService;
import com.stackroute.recommendationservice.services.RecommendationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@CrossOrigin
public class RecommendationController {

	private final RecommendationService recommendationService;
	private final QueryService queryService;

	public RecommendationController(RecommendationService recommendationService, QueryService queryService) {
		this.recommendationService = recommendationService;
		this.queryService = queryService;
	}


	@GetMapping("/recommend/{id}")
	public List<PostResp> recommend(@PathVariable(value = "id") String userId) throws ExecutionException, InterruptedException {
		Collection<Post> posts = recommendationService.recommend(userId);
		return generateResp(posts);
	}

	@GetMapping("/recommend/ageGroup/{id}")
	public List<PostResp> recommendByAgeGroup(@PathVariable(value = "id") String userId) {
		Collection<Post> posts = recommendationService.byAgeGroup(userId);
		return generateResp(posts);
	}

	@GetMapping("/recommend/newsPreference/{id}")
	public List<PostResp> recommendByPreference(@PathVariable(value = "id") String userId) {
		Collection<Post> posts = recommendationService.byPreferences(userId);
		return generateResp(posts);
	}

	private List<PostResp> generateResp(Collection<Post> posts) {
		List<PostResp> resp= new ArrayList<>();
		for(Post post: posts) {
			PostResp postResp = new PostResp(
			        post.getVideoID(),
					post.getTitle(),
					post.getVideoUrl(),
					post.getTags(),
                    post.getLocation().getName(),
					post.getSubCategory().getName(),
					post.getPostedBy(),
					post.getTimestamp());
			resp.add(postResp);
		}
		return resp;
	}
}
