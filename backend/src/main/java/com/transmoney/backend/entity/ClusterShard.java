package com.transmoney.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Distributed Shard / Partition Node Catalog.
 * Aligns with DDBMS Syllabus Week 2 & 4: Distributed Directory & Horizontal Fragmentation Catalog.
 */
@Entity
@Table(name = "cluster_shards", indexes = {
    @Index(name = "idx_shard_identifier", columnList = "shard_id", unique = true),
    @Index(name = "idx_shard_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClusterShard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shard_id", nullable = false, unique = true, length = 64)
    private String shardId;

    @Column(name = "shard_name", nullable = false, length = 128)
    private String shardName;

    @Column(name = "region", nullable = false, length = 128)
    private String region;

    @Column(name = "host_endpoint", nullable = false, length = 256)
    private String hostEndpoint;

    @Column(name = "primary_port")
    private Integer primaryPort;

    @Column(name = "replica_port")
    private Integer replicaPort;

    @Column(name = "status", nullable = false, length = 32)
    @Builder.Default
    private String status = "ONLINE";

    @Column(name = "currency", nullable = false, length = 10)
    @Builder.Default
    private String currency = "PKR";

    @Column(name = "hash_range_start")
    private Long hashRangeStart;

    @Column(name = "hash_range_end")
    private Long hashRangeEnd;

    @Column(name = "active_accounts_count")
    @Builder.Default
    private Long activeAccountsCount = 0L;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
