package aditya_zalte.Mess_Mate_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "weekly_menu_item")
@Data
public class WeeklyMenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_menu_id")
    private WeeklyMenu weeklyMenu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

}
