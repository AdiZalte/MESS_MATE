package aditya_zalte.Mess_Mate_backend.dto;

import aditya_zalte.Mess_Mate_backend.model.enums.MessType;
import aditya_zalte.Mess_Mate_backend.model.enums.PriceType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
public class CreateMessDto {

    @NotBlank(message = "Mess name is required")
    private String name;

    @Size(max = 50, message = "Description must be under 50 characters")
    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    private String locality;

    @NotNull(message = "Latitude is required")
    private BigDecimal latitude;

    @NotNull(message = "Longitude is required")
    private BigDecimal longitude;

    @NotNull(message = "Mess type is required")
    private MessType messType;

    @NotNull(message = "Price type is required")
    private PriceType priceType;

    private BigDecimal avgPricePerMeal;

    @NotNull(message = "Opening time is required")
    private LocalTime openingTime;

    @NotNull(message = "Closing time is required")
    private LocalTime closingTime;

    private String coverImageUrl1;
    private String coverImageUrl2;
    private String coverImageUrl3;

    private Boolean isVeg;
    private Boolean isTiffin;
}