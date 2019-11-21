package com.stackroute.contentservice.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import java.math.BigInteger;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "posts")
@Getter
@Setter
@Builder
public class Post {
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
