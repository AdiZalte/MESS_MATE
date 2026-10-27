package aditya_zalte.Mess_Mate_backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdminMessDto {
    private String id;
    private String name;
    private String address;
    private String city;
    private String locality;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal avgPricePerMeal;
    private String coverImageUrl1;

    private Boolean isVerified;
    private Boolean isActive;
    private LocalDateTime createdAt;

    private String ownerName;
    private String ownerEmail;
    private String ownerPhone;
}