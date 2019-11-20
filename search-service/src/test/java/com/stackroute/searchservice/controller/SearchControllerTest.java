package com.stackroute.searchservice.controller;

import com.stackroute.searchservice.exceptions.CategoryNotFoundException;
import com.stackroute.searchservice.exceptions.LocationNotFoundException;
import com.stackroute.searchservice.service.CategoryService;
import com.stackroute.searchservice.service.LocationService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@WebMvcTest
public class SearchControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Mock
    private CategoryService categoryService;
    @Mock
    private LocationService locationService;

    @InjectMocks
    private SearchController searchController;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(searchController)
                .build();
    }

    @Test
    public void getCategory() throws Exception {
        when(categoryService.getCategory(any())).thenReturn(null);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/category/"+ "Sports"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void getCategoryFailure() throws Exception {
        when(categoryService.getCategory(any())).thenThrow(CategoryNotFoundException.class);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/category/"+ "Sports"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void getLocation() throws Exception {
        when(locationService.getLocation(any())).thenReturn(null);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/location/"+ "Kolkata"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void getLocationFailure() throws Exception {
        when(locationService.getLocation(any())).thenThrow(LocationNotFoundException.class);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/location/"+ "Kolkata"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }
}
