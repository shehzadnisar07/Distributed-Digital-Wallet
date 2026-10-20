package com.transmoney.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Distributed Two-Phase Commit (2PC) Write-Ahead Log (WAL).
 * Aligns with DDBMS Syllabus Week 9 & 10: Distributed Reliability, 2PC Commit Protocols & Crash Recovery.
 */
@Entity
@Table(name = "two_phase_commit_logs", indexes = {
    @Index(name = "idx_2pc_tx_id", columnList = "transaction_id"),
    @Index(name = "idx_2pc_phase", columnList = "phase"),
    @Index(name = "idx_2pc_logged_at", columnList = "logged_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TwoPhaseCommitLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", nullable = false, length = 64)
    private String transactionId;

    @Column(name = "phase", nullable = false, length = 64)
    private String phase; // INITIATE, PREPARE_VOTE_COMMIT, PREPARE_VOTE_ABORT, GLOBAL_COMMIT, GLOBAL_ABORT, RECOVERY_HEALED

    @Column(name = "coordinator_node", length = 64)
    @Builder.Default
    private String coordinatorNode = "COORD_PRIMARY";

    @Column(name = "sender_shard", length = 64)
    private String senderShard;

    @Column(name = "receiver_shard", length = 64)
    private String receiverShard;

    @Column(name = "details", length = 1000)
    private String details;

    @CreationTimestamp
    @Column(name = "logged_at", nullable = false, updatable = false)
    private LocalDateTime loggedAt;
}
