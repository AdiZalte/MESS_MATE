package aditya_zalte.Mess_Mate_backend.dto;

import aditya_zalte.Mess_Mate_backend.model.enums.MealType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WeeklyMenuItemDto {

    @NotBlank(message = "Item name is required")
    private String name;

    @NotNull(message = "Veg status is required")
    private Boolean isVeg;

    @NotNull(message = "Meal type is required")
    private MealType mealType;
}