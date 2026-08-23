package aditya_zalte.Mess_Mate_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
public class NotificationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mess_id")
    private Mess mess;

    private String type; // "MENU_POSTED", "MENU_CHANGED", "MESS_CLOSED"

    private String title;

    @Column(length = 500)
    private String body;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}