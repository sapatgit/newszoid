package com.stackroute.contentservice.service;

import com.stackroute.contentservice.domain.Post;
import com.stackroute.contentservice.domain.SortByViews;
import com.stackroute.contentservice.exception.PostAlreadyExistsException;
import com.stackroute.contentservice.exception.PostNotFoundException;
import com.stackroute.contentservice.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class PostServiceImpl implements PostService{

    private static final Logger logger = LoggerFactory.getLogger(PostServiceImpl.class);

    private PostRepository postRepository;

    @Autowired
    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public Post getPost(BigInteger id) throws PostNotFoundException {
        if(postRepository.findById(id).isEmpty()) {
           throw new PostNotFoundException("Post with id: "+id+" not found!");
        }
        return postRepository.findById(id).get();
    }

    @Override
    public Post savePost(Post post) throws PostAlreadyExistsException {
        if(!postRepository.findById(post.getId()).isEmpty()) {
            throw new PostAlreadyExistsException("Post with id: "+post.getId()+" already exists!");
        }
        return postRepository.save(post);
    }

    @Override
    public Post updatePost(Post post) throws PostNotFoundException {
        if(postRepository.findById(post.getId()).isEmpty()) {
            throw new PostNotFoundException("Post with id: "+post.getId()+" not found!");
        }
        return postRepository.save(post);
    }

    @Override
    public Post deletePost(BigInteger id) throws PostNotFoundException {
        if(postRepository.findById(id).isEmpty()) {
            throw new PostNotFoundException("Post with id: "+id+" not found!");
        }
        Post post = postRepository.findById(id).get();
        postRepository.delete(post);
        return post;
    }

    @Override
    public List<Post> getAllPosts() throws PostNotFoundException {
        if(postRepository.findAll().isEmpty()){
            throw new PostNotFoundException(("No Posts"));
        }
        return postRepository.findAll();
    }

    @Override
    public List<Post> getPostsByCategory(String category) throws PostNotFoundException {
        List<Post> postsbyCategory=new ArrayList<>();
        List<Post> allPosts=getAllPosts();
        for (Post post:allPosts) {
            if(category.equals(post.getCategory())){
                postsbyCategory.add(post);
            }
        }
        return postsbyCategory;
    }

    @Override
    public List<Post> getTrendingPosts(List<Post> posts) throws PostNotFoundException {

        LocalDate localDate = LocalDate.now();
        String str=localDate.toString();
        List<Post> trendingPosts=new ArrayList<Post>();
        for(Post post:posts){
            String string=post.getTimestamp()
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate()
                    .toString();
            logger.debug("postdate:"+string);
            if(string.equals(str)){
                trendingPosts.add(post);
            }
        }
        Comparator c = Collections.reverseOrder(new SortByViews());
        Collections.sort(trendingPosts, c);

        return trendingPosts;
    }
}

