package com.transmoney.backend.repository;

import com.transmoney.backend.entity.ClusterShard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClusterShardRepository extends JpaRepository<ClusterShard, Long> {
    Optional<ClusterShard> findByShardId(String shardId);
    boolean existsByShardId(String shardId);
}
