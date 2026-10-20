package com.transmoney.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Historical Exchange Rate Series for Statistical Modeling.
 * Aligns with requirement: Real data / statistical model based multi-currency FX rates.
 */
@Entity
@Table(name = "fx_rate_history", indexes = {
    @Index(name = "idx_fx_currency_pair", columnList = "currency_pair"),
    @Index(name = "idx_fx_observed_at", columnList = "observed_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FxRateHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "currency_pair", nullable = false, length = 16)
    private String currencyPair; // e.g. USD/PKR, EUR/PKR, GBP/PKR, AED/PKR, EUR/USD

    @Column(name = "rate", nullable = false, precision = 18, scale = 6)
    private BigDecimal rate;

    @Column(name = "spread_percent", precision = 8, scale = 4)
    @Builder.Default
    private BigDecimal spreadPercent = new BigDecimal("0.3500");

    @Column(name = "volatility_sigma", precision = 8, scale = 4)
    @Builder.Default
    private BigDecimal volatilitySigma = new BigDecimal("0.0125");

    @Column(name = "observed_at", nullable = false)
    private LocalDateTime observedAt;
}
