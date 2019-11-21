package com.stackroute.recommendationservice.domain;

import java.util.Date;
import java.util.List;

import lombok.*;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

@NodeEntity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class Post {
	@Id
	private Long videoID;
	private String title;
	private String videoUrl;
	private List<String> tags;
	@Relationship(type = "NEWS_LOCATION", direction = Relationship.OUTGOING)
	private Location location;
	@Relationship(type = "BelongsTo", direction = Relationship.OUTGOING)
	private SubCategory subCategory;
	private String postedBy;
	private Date timestamp;
	private String loc;
	private String sc;
}
