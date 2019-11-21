package com.stackroute.contentservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackroute.contentservice.domain.Post;
import com.stackroute.contentservice.exception.PostAlreadyExistsException;
import com.stackroute.contentservice.exception.PostNotFoundException;
import com.stackroute.contentservice.service.PostService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class PostControllerTest {
    @Autowired
    private MockMvc mockMvc;
    private Post post;

    @Mock
    private PostService postService;
    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private PostController postController;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(postController)
                .build();
        post = Post.builder()
                    .location("loc")
                    .category("cat")
                    .build();
    }

    @Test
    public void getPostSuccess() throws Exception {
        when(postService.getPost(any())).thenReturn(null);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/post/"+ "1234"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void getPostFailure() throws Exception {
        when(postService.getPost(any())).thenThrow(PostNotFoundException.class);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/post/"+ "1234"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void savePost() throws Exception {
        when(postService.savePost(any())).thenReturn(post);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(post)))
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    public void savePostFailureConflict() throws Exception {
        when(postService.savePost(any())).thenThrow(PostAlreadyExistsException.class);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(post)))
                .andExpect(MockMvcResultMatchers.status().isConflict());
    }

    @Test
    public void savePostFailureBadRequest() throws Exception {
        when(postService.savePost(any())).thenThrow(PostAlreadyExistsException.class);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void updatePostSuccess() throws Exception {
        when(postService.updatePost(any())).thenReturn(post);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(post)))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void updatePostFailureNotFound() throws Exception {
        when(postService.updatePost(any())).thenThrow(PostNotFoundException.class);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(post)))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void updatePostFailureBadRequest() throws Exception {
        when(postService.updatePost(any())).thenReturn(post);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void deletePost() throws Exception {
        when(postService.deletePost(any())).thenReturn(post);
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/post/" + "19312"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void deletePostFailure() throws Exception {
        when(postService.deletePost(any())).thenThrow(PostNotFoundException.class);
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/post/" + "19312"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void getAllPosts() throws Exception {
        when(postService.getAllPosts()).thenReturn(null);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/posts"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }


    @Test
    public void getPostsByCategory() throws Exception {
        when(postService.getPostsByCategory(any())).thenReturn(null);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/posts/" + "cat"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void getPostsByCategoryFailure() throws Exception {
        when(postService.getPostsByCategory(any())).thenThrow(PostNotFoundException.class);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/posts/" + "cat"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void getTrendingPosts() throws Exception {
        when(postService.getPostsByCategory(any())).thenReturn(null);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/posts/" + "cat"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    private static String asJsonString(final Object obj) {
        try{
            return new ObjectMapper().writeValueAsString(obj);
        }catch(Exception e){
            throw new RuntimeException(e);
        }
    }
}
