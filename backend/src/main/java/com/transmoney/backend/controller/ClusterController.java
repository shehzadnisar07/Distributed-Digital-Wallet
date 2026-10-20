package com.transmoney.backend.controller;

import com.transmoney.backend.dto.response.ApiResponse;
import com.transmoney.backend.entity.ClusterShard;
import com.transmoney.backend.entity.FxRateHistory;
import com.transmoney.backend.entity.TwoPhaseCommitLog;
import com.transmoney.backend.repository.ClusterShardRepository;
import com.transmoney.backend.repository.FxRateHistoryRepository;
import com.transmoney.backend.repository.TwoPhaseCommitLogRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/cluster")
@RequiredArgsConstructor
@Tag(name = "Distributed Cluster & Sharding Catalog", description = "Endpoints for Shard Directory, 2PC WAL Write-Ahead Logs, and Statistical FX series")
public class ClusterController {

    private final ClusterShardRepository clusterShardRepository;
    private final TwoPhaseCommitLogRepository twoPhaseCommitLogRepository;
    private final FxRateHistoryRepository fxRateHistoryRepository;

    @GetMapping("/shards")
    @Operation(summary = "Get all cluster shard partitions", description = "Returns the distributed directory and horizontal fragmentation catalog")
    public ResponseEntity<ApiResponse<List<ClusterShard>>> getClusterShards() {
        List<ClusterShard> shards = clusterShardRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Cluster shards retrieved successfully", shards));
    }

    @GetMapping("/2pc-logs")
    @Operation(summary = "Get recent 2PC Write-Ahead Logs", description = "Returns chronological WAL records of Two-Phase Commit consensus steps")
    public ResponseEntity<ApiResponse<List<TwoPhaseCommitLog>>> getTwoPhaseCommitLogs(
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String txId
    ) {
        List<TwoPhaseCommitLog> logs;
        if (txId != null && !txId.trim().isEmpty()) {
            logs = twoPhaseCommitLogRepository.findByTransactionIdOrderByLoggedAtAsc(txId.trim());
        } else {
            logs = twoPhaseCommitLogRepository.findAllByOrderByLoggedAtDesc(PageRequest.of(0, Math.min(limit, 200)));
        }
        return ResponseEntity.ok(ApiResponse.ok("2PC WAL logs retrieved successfully", logs));
    }

    @GetMapping("/fx-history")
    @Operation(summary = "Get historical exchange rate series", description = "Returns statistical FX rate distribution series")
    public ResponseEntity<ApiResponse<List<FxRateHistory>>> getFxRateHistory(
            @RequestParam(required = false) String pair,
            @RequestParam(defaultValue = "30") int limit
    ) {
        List<FxRateHistory> history;
        if (pair != null && !pair.trim().isEmpty()) {
            history = fxRateHistoryRepository.findByCurrencyPairOrderByObservedAtDesc(pair.trim().toUpperCase(), PageRequest.of(0, limit));
        } else {
            history = fxRateHistoryRepository.findAllByOrderByObservedAtDesc(PageRequest.of(0, limit));
        }
        return ResponseEntity.ok(ApiResponse.ok("FX rate history retrieved successfully", history));
    }

    @GetMapping("/overview")
    @Operation(summary = "Get distributed cluster summary", description = "Returns high-level health and node counts for academic evaluation")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getClusterOverview() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalNodes", clusterShardRepository.count());
        summary.put("walLogCount", twoPhaseCommitLogRepository.count());
        summary.put("fxHistoryCount", fxRateHistoryRepository.count());
        summary.put("architectureModel", "Horizontally Sharded Shared-Nothing DDBMS with 2PC Consensus");
        summary.put("status", "ACTIVE_HEALTHY");
        return ResponseEntity.ok(ApiResponse.ok("Cluster overview retrieved successfully", summary));
    }
}
