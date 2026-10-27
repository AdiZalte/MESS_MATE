package aditya_zalte.Mess_Mate_backend.dto;

import aditya_zalte.Mess_Mate_backend.model.enums.MessType;
import aditya_zalte.Mess_Mate_backend.model.enums.PriceType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
public class MessResponseDto {

    private String id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String locality;

    private BigDecimal latitude;
    private BigDecimal longitude;

    private MessType messType;
    private PriceType priceType;
    private BigDecimal avgPricePerMeal;

    private LocalTime openingTime;
    private LocalTime closingTime;

    private String coverImageUrl1;
    private String coverImageUrl2;
    private String coverImageUrl3;

    private Boolean isVeg;
    private Boolean isActive;
    private Boolean isVerified;
    private Boolean isTiffin;

    private BigDecimal avgRating;
    private Integer totalRatings;
}