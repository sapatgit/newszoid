package com.stackroute.recommendationservice.domain;

import lombok.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class PostDTO implements Serializable {
    private long id;
    private String title;
    private String videoUrl;
    private Date timestamp;
    private String category;
    private String location;
    private String fullLocation;
    private List<String> tags;
    private boolean isAnonymous;
    private String postedBy;
    private List<String> likedBy;
    private List<String> flaggedBy;
    private List<String> watchedBy;
    private List<String> boughtBy;
}
