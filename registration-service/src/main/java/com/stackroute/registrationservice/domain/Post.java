package com.stackroute.registrationservice.domain;

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
@ToString
public class Post {

    @Id
    private BigInteger id;
    private String title;
    private String videoUrl;
    private Date timestamp;
    private String location;
    private String fullLocation;
    private List<String> tags;
    private String category;
}
