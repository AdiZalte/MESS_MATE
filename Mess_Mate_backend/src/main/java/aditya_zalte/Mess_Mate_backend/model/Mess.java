package aditya_zalte.Mess_Mate_backend.model;

import aditya_zalte.Mess_Mate_backend.model.enums.MessType;
import aditya_zalte.Mess_Mate_backend.model.enums.PriceType;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
public class Mess {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mess_owner_id", unique = true)
    private MessOwner owner;

    private String name;

    @Column(length = 50)
    private String description;

    private String address;
    private String city;
    private String locality;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    private MessType messType;

    @Enumerated(EnumType.STRING)
    private PriceType priceType;


    private BigDecimal avgPricePerMeal;

    private LocalTime openingTime;
    private LocalTime closingTime;

    private String coverImageUrl1;
    private String coverImageUrl2;
    private String coverImageUrl3;


    private Boolean isActive = true;
    private Boolean isVerified = false;
    private Boolean isVeg = true;
    private Boolean isTiffin = false;

    private BigDecimal avgRating = BigDecimal.ZERO;
    private Integer totalRatings = 0;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;





    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }




}
