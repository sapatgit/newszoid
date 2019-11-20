package com.stackroute.searchservice.service;

import com.stackroute.searchservice.domain.Location;
import com.stackroute.searchservice.exceptions.LocationAlreadyExistsException;
import com.stackroute.searchservice.exceptions.LocationNotFoundException;
import com.stackroute.searchservice.repository.LocationRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class LocationServiceTest {
    private Location location;
    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private LocationServiceImpl locationService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        location = Location.builder()
                .location("loc")
                .build();
    }

    @Test
    public void testGetLocationSuccess() throws LocationNotFoundException {
        when(locationRepository.findLocationByLocation(any())).thenReturn(location);
        locationService.getLocation("loc");
        verify(locationRepository, times(1)).findLocationByLocation("loc");
    }

    @Test(expected = LocationNotFoundException.class)
    public void testGetLocationFailure() throws LocationNotFoundException {
        when(locationRepository.findLocationByLocation(any())).thenReturn(null);
        locationService.getLocation("loc");
    }

    @Test
    public void testAddLocationSuccess() throws LocationAlreadyExistsException {
        when(locationRepository.findLocationByLocation(any())).thenReturn(null);
        locationService.addLocation(location);
        verify(locationRepository, times(1)).findLocationByLocation("loc");
        verify(locationRepository, times(1)).save(location);
    }

    @Test(expected = LocationAlreadyExistsException.class)
    public void testAddLocationFailure() throws LocationAlreadyExistsException {
        when(locationRepository.findLocationByLocation(any())).thenReturn(location);
        locationService.addLocation(location);
    }

    @Test
    public void testUpdateLocationSuccess() throws LocationNotFoundException {
        when(locationRepository.findLocationByLocation(any())).thenReturn(location);
        locationService.updateLocation(location);
        verify(locationRepository, times(1)).findLocationByLocation("loc");
        verify(locationRepository, times(1)).save(location);
    }

    @Test(expected = LocationNotFoundException.class)
    public void testUpdateLocationFailure() throws LocationNotFoundException {
        when(locationRepository.findLocationByLocation(any())).thenReturn(null);
        locationService.updateLocation(location);
    }

    @Test
    public void testDeleteLocationSuccess() throws LocationNotFoundException {
        when(locationRepository.findLocationByLocation(any())).thenReturn(location);
        locationService.deleteLocation("loc");
        verify(locationRepository, times(1)).findLocationByLocation("loc");
        verify(locationRepository, times(1)).delete(location);
    }

    @Test(expected = LocationNotFoundException.class)
    public void testDeleteLocationFailure() throws LocationNotFoundException {
        when(locationRepository.findLocationByLocation(any())).thenReturn(null);
        locationService.deleteLocation("loc");
    }
}
