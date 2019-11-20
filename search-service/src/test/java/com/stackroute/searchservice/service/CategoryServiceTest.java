package com.stackroute.searchservice.service;

import com.stackroute.searchservice.domain.Category;
import com.stackroute.searchservice.exceptions.CategoryAlreadyExistsException;
import com.stackroute.searchservice.exceptions.CategoryNotFoundException;
import com.stackroute.searchservice.repository.CategoryRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CategoryServiceTest {
    private Category category;
    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        category = Category.builder()
                            .category("cat")
                            .build();
    }

    @Test
    public void testGetCategorySuccess() throws CategoryNotFoundException {
        when(categoryRepository.findCategoryByCategory(any())).thenReturn(category);
        categoryService.getCategory("cat");
        verify(categoryRepository, times(1)).findCategoryByCategory("cat");
    }

    @Test(expected = CategoryNotFoundException.class)
    public void testGetCategoryFailure() throws CategoryNotFoundException {
        when(categoryRepository.findCategoryByCategory(any())).thenReturn(null);
        categoryService.getCategory("cat");
    }

    @Test
    public void testAddCategorySuccess() throws CategoryAlreadyExistsException {
        when(categoryRepository.findCategoryByCategory(any())).thenReturn(null);
        categoryService.addCategory(category);
        verify(categoryRepository, times(1)).findCategoryByCategory("cat");
        verify(categoryRepository, times(1)).save(category);
    }

    @Test(expected = CategoryAlreadyExistsException.class)
    public void testAddCategoryFailure() throws CategoryAlreadyExistsException {
        when(categoryRepository.findCategoryByCategory(any())).thenReturn(category);
        categoryService.addCategory(category);
    }

    @Test
    public void testUpdateCategorySuccess() throws CategoryNotFoundException {
        when(categoryRepository.findCategoryByCategory(any())).thenReturn(category);
        categoryService.updateCategory(category);
        verify(categoryRepository, times(1)).findCategoryByCategory("cat");
        verify(categoryRepository, times(1)).save(category);
    }

    @Test(expected = CategoryNotFoundException.class)
    public void testUpdateCategoryFailure() throws CategoryNotFoundException {
        when(categoryRepository.findCategoryByCategory(any())).thenReturn(null);
        categoryService.updateCategory(category);
    }

    @Test
    public void testDeleteCategorySuccess() throws CategoryNotFoundException {
        when(categoryRepository.findCategoryByCategory(any())).thenReturn(category);
        categoryService.deleteCategory("cat");
        verify(categoryRepository, times(1)).findCategoryByCategory("cat");
        verify(categoryRepository, times(1)).delete(category);
    }

    @Test(expected = CategoryNotFoundException.class)
    public void testDeleteCategoryFailure() throws CategoryNotFoundException {
        when(categoryRepository.findCategoryByCategory(any())).thenReturn(null);
        categoryService.deleteCategory("cat");
    }
}
