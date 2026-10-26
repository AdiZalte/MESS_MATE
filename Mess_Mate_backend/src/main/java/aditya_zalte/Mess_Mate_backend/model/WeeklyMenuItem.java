package aditya_zalte.Mess_Mate_backend.model;

import aditya_zalte.Mess_Mate_backend.model.enums.MealType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(
        name = "weekly_menu_item",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"weekly_menu_id", "menu_item_id", "meal_type"}
        )
)
@Data
public class WeeklyMenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealType mealType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_menu_id" , nullable = false)
    private WeeklyMenu weeklyMenu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id" , nullable = false)
    private MenuItem menuItem;

}
