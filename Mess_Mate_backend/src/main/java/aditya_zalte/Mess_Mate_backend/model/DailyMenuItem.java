package aditya_zalte.Mess_Mate_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "daily_menu_item",
        uniqueConstraints = @UniqueConstraint(columnNames = {"mess_id", "date"})
)

@Data
public class DailyMenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_menu_id")
    private DailyMenu dailyMenu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;
}
