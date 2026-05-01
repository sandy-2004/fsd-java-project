package com.project.ecom_BD.model;

import java.math.BigDecimal;
import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
 
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Integer id;
 private String name;
 private String description;
 private String brand;
 private BigDecimal price;
 private String category;
 @JsonFormat(pattern = "dd-MM-yyyy")
 private Date releaseDate;
 private boolean available;
 private int quantity;
 private String imageName;
 private String imageType;
 @Lob
 private byte[] imageData;
}
