package com.stackroute.searchservice.domain;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PostDTO {
    @Id
    private BigInteger id;
    private String title;
    private String videoUrl;
    private Date timestamp;
    private String postedBy;
    private List<String> tags;
    private String category;
    private String location;
    private String fullLocation;
    private List<String> likedBy;
    private List<String> flaggedBy;
    private List<String> watchedBy;
    private List<String> boughtBy;
}
