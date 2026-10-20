package com.transmoney.backend.config;

import com.transmoney.backend.entity.ClusterShard;
import com.transmoney.backend.entity.FxRateHistory;
import com.transmoney.backend.repository.ClusterShardRepository;
import com.transmoney.backend.repository.FxRateHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ClusterShardRepository clusterShardRepository;
    private final FxRateHistoryRepository fxRateHistoryRepository;

    @Override
    public void run(String... args) {
        log.info("=== TransMoney Distributed Ledger Engine Initialized ===");
        seedClusterShards();
        seedFxRateHistory();
    }

    private void seedClusterShards() {
        if (clusterShardRepository.count() == 0) {
            log.info("Initializing Distributed Cluster Shard Directory (Syllabus Week 2 & 4)...");
            List<ClusterShard> shards = List.of(
                    ClusterShard.builder()
                            .shardId("SHARD_1_NORTH")
                            .shardName("North Pakistan Regional Partition")
                            .region("Islamabad / Rawalpindi / KP")
                            .hostEndpoint("node-north.transmoney.internal")
                            .primaryPort(5432)
                            .replicaPort(5433)
                            .status("ONLINE")
                            .currency("PKR")
                            .hashRangeStart(1L)
                            .hashRangeEnd(10000000L)
                            .activeAccountsCount(125000L)
                            .build(),
                    ClusterShard.builder()
                            .shardId("SHARD_2_CENTRAL")
                            .shardName("Central Pakistan Regional Partition")
                            .region("Lahore / Faisalabad / Punjab")
                            .hostEndpoint("node-central.transmoney.internal")
                            .primaryPort(5434)
                            .replicaPort(5435)
                            .status("ONLINE")
                            .currency("PKR")
                            .hashRangeStart(10000001L)
                            .hashRangeEnd(20000000L)
                            .activeAccountsCount(248000L)
                            .build(),
                    ClusterShard.builder()
                            .shardId("SHARD_3_SOUTH")
                            .shardName("South Pakistan Regional Partition")
                            .region("Karachi / Hyderabad / Sindh")
                            .hostEndpoint("node-south.transmoney.internal")
                            .primaryPort(5436)
                            .replicaPort(5437)
                            .status("ONLINE")
                            .currency("PKR")
                            .hashRangeStart(20000001L)
                            .hashRangeEnd(30000000L)
                            .activeAccountsCount(310000L)
                            .build(),
                    ClusterShard.builder()
                            .shardId("SHARD_4_ENTERPRISE")
                            .shardName("Enterprise & High-Volume Clearing Partition")
                            .region("Karachi FinTech Enterprise Center")
                            .hostEndpoint("node-enterprise.transmoney.internal")
                            .primaryPort(5438)
                            .replicaPort(5439)
                            .status("ONLINE")
                            .currency("PKR")
                            .hashRangeStart(30000001L)
                            .hashRangeEnd(40000000L)
                            .activeAccountsCount(45000L)
                            .build(),
                    ClusterShard.builder()
                            .shardId("SHARD_1_US")
                            .shardName("North America FX Settlement Hub")
                            .region("New York, USA")
                            .hostEndpoint("node-us-east.transmoney.internal")
                            .primaryPort(5440)
                            .replicaPort(5441)
                            .status("ONLINE")
                            .currency("USD")
                            .hashRangeStart(40000001L)
                            .hashRangeEnd(50000000L)
                            .activeAccountsCount(18500L)
                            .build(),
                    ClusterShard.builder()
                            .shardId("SHARD_2_UK")
                            .shardName("Europe & UK Cross-Border Clearing Gateway")
                            .region("London, United Kingdom")
                            .hostEndpoint("node-uk-lon.transmoney.internal")
                            .primaryPort(5442)
                            .replicaPort(5443)
                            .status("ONLINE")
                            .currency("GBP")
                            .hashRangeStart(50000001L)
                            .hashRangeEnd(60000000L)
                            .activeAccountsCount(14200L)
                            .build()
            );
            clusterShardRepository.saveAll(shards);
            log.info("Provisioned {} distributed cluster shards in fragmentation catalog.", shards.size());
        }
    }

    private void seedFxRateHistory() {
        if (fxRateHistoryRepository.count() == 0) {
            log.info("Initializing Statistical FX Rate Series (Real Market Data Model)...");
            LocalDateTime now = LocalDateTime.now();
            List<FxRateHistory> series = List.of(
                    FxRateHistory.builder().currencyPair("USD/PKR").rate(new BigDecimal("278.500000")).spreadPercent(new BigDecimal("0.3500")).volatilitySigma(new BigDecimal("0.0125")).observedAt(now.minusHours(4)).build(),
                    FxRateHistory.builder().currencyPair("USD/PKR").rate(new BigDecimal("278.350000")).spreadPercent(new BigDecimal("0.3500")).volatilitySigma(new BigDecimal("0.0125")).observedAt(now.minusHours(3)).build(),
                    FxRateHistory.builder().currencyPair("USD/PKR").rate(new BigDecimal("278.600000")).spreadPercent(new BigDecimal("0.3500")).volatilitySigma(new BigDecimal("0.0125")).observedAt(now.minusHours(2)).build(),
                    FxRateHistory.builder().currencyPair("USD/PKR").rate(new BigDecimal("278.480000")).spreadPercent(new BigDecimal("0.3500")).volatilitySigma(new BigDecimal("0.0125")).observedAt(now.minusHours(1)).build(),
                    FxRateHistory.builder().currencyPair("USD/PKR").rate(new BigDecimal("278.500000")).spreadPercent(new BigDecimal("0.3500")).volatilitySigma(new BigDecimal("0.0125")).observedAt(now).build(),

                    FxRateHistory.builder().currencyPair("EUR/USD").rate(new BigDecimal("1.087000")).spreadPercent(new BigDecimal("0.3000")).volatilitySigma(new BigDecimal("0.0080")).observedAt(now.minusHours(2)).build(),
                    FxRateHistory.builder().currencyPair("EUR/USD").rate(new BigDecimal("1.086500")).spreadPercent(new BigDecimal("0.3000")).volatilitySigma(new BigDecimal("0.0080")).observedAt(now).build(),

                    FxRateHistory.builder().currencyPair("GBP/USD").rate(new BigDecimal("1.282000")).spreadPercent(new BigDecimal("0.3200")).volatilitySigma(new BigDecimal("0.0090")).observedAt(now.minusHours(2)).build(),
                    FxRateHistory.builder().currencyPair("GBP/USD").rate(new BigDecimal("1.282500")).spreadPercent(new BigDecimal("0.3200")).volatilitySigma(new BigDecimal("0.0090")).observedAt(now).build(),

                    FxRateHistory.builder().currencyPair("USD/AED").rate(new BigDecimal("3.672500")).spreadPercent(new BigDecimal("0.1000")).volatilitySigma(new BigDecimal("0.0005")).observedAt(now.minusHours(2)).build(),
                    FxRateHistory.builder().currencyPair("USD/AED").rate(new BigDecimal("3.672500")).spreadPercent(new BigDecimal("0.1000")).volatilitySigma(new BigDecimal("0.0005")).observedAt(now).build()
            );
            fxRateHistoryRepository.saveAll(series);
            log.info("Seeded {} statistical FX rate observations.", series.size());
        }
    }
}
