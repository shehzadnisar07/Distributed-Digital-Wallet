package com.transmoney.backend.repository;

import com.transmoney.backend.entity.FxRateHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FxRateHistoryRepository extends JpaRepository<FxRateHistory, Long> {
    List<FxRateHistory> findByCurrencyPairOrderByObservedAtDesc(String currencyPair, Pageable pageable);
    List<FxRateHistory> findAllByOrderByObservedAtDesc(Pageable pageable);
}
