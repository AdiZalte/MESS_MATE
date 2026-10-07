package aditya_zalte.Mess_Mate_backend.model;

import aditya_zalte.Mess_Mate_backend.model.enums.DayOfWeek;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "weekly_menu",
        uniqueConstraints = @UniqueConstraint(columnNames = {"mess_id", "day_of_week"})
)
@Data
public class WeeklyMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mess_id" , nullable = false)
    private Mess mess;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    @OneToMany(mappedBy = "weeklyMenu",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<WeeklyMenuItem> items;

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