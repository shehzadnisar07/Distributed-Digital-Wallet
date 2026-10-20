package com.transmoney.backend.repository;

import com.transmoney.backend.entity.TwoPhaseCommitLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TwoPhaseCommitLogRepository extends JpaRepository<TwoPhaseCommitLog, Long> {
    List<TwoPhaseCommitLog> findByTransactionIdOrderByLoggedAtAsc(String transactionId);
    List<TwoPhaseCommitLog> findAllByOrderByLoggedAtDesc(Pageable pageable);
}
