package aditya_zalte.Mess_Mate_backend.model;

import jakarta.persistence.Table;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(
        name = "daily_menu"
//        uniqueConstraints = @UniqueConstraint(columnNames = {"mess_id", "date"})
)
@Data
public class DailyMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mess_id")
    private Mess mess;

    private LocalDate date;

    @OneToMany(mappedBy = "dailyMenu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DailyMenuItem> items;

    private LocalDateTime postedAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        postedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
