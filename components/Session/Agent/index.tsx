import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { RTVIEvent, RTVIClient, RTVIMessage } from "realtime-ai";
import { useRTVIClient, useRTVIClientEvent, VoiceVisualizer } from "realtime-ai-react";

import ModelBadge from "./model";

import styles from "./styles.module.css";

export const Agent: React.FC<{
  isReady: boolean;
  statsAggregator: StatsAggregator;
}> = memo(
  ({ isReady, statsAggregator }) => {
    const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
    
    // Print conversation history
    const printHistory = useCallback(() => {
      if (messages.length > 0) {
        console.log('\n=== Conversation History ===');
        messages.forEach(msg => {
          console.log(`[${msg.role.toUpperCase()}]: ${msg.content}`);
        });
        console.log('=========================\n');
      }
    }, [messages]);
    const voiceClient = useRTVIClient()!;
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [botStatus, setBotStatus] = useState<
      "initializing" | "connected" | "disconnected"
    >("initializing");
    const [botIsTalking, setBotIsTalking] = useState<boolean>(false);
    const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSpeakTimeRef = useRef<number>(Date.now());
    const RESPONSE_TIMEOUT = 2500; // 2.5 seconds timeout

    useEffect(() => {
      // Update the started state when the transport enters the ready state
      if (!isReady) return;
      setHasStarted(true);
      setBotStatus("connected");
    }, [isReady]);

    // Log LLM messages
    useRTVIClientEvent(
      RTVIEvent.LLMMessage,
      useCallback((message: RTVIMessage) => {
        const llmMessage = message.data as { role: string; content: string };
        setMessages(prev => [...prev, llmMessage]);
        console.log(`[${llmMessage.role.toUpperCase()}]: ${llmMessage.content}`);
      }, [])
    );

    // Log user messages
    useRTVIClientEvent(
      RTVIEvent.UserMessage,
      useCallback((message: RTVIMessage) => {
        const userMessage = message.data as { content: string };
        setMessages(prev => [...prev, { role: 'user', content: userMessage.content }]);
        console.log(`[USER]: ${userMessage.content}`);
      }, [])
    );

    useRTVIClientEvent(
      RTVIEvent.BotDisconnected,
      useCallback(() => {
        setHasStarted(false);
        setBotStatus("disconnected");
        printHistory(); // Print history when bot disconnects
      }, [printHistory])
    );

    useRTVIClientEvent(
      RTVIEvent.BotStartedSpeaking,
      useCallback(() => {
        console.log('[SYSTEM]: Bot started speaking');
        setBotIsTalking(true);
        lastSpeakTimeRef.current = Date.now();
        // Clear any existing timeout when bot starts speaking
        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
          responseTimeoutRef.current = null;
        }
      }, [])
    );

    useRTVIClientEvent(
      RTVIEvent.BotStoppedSpeaking,
      useCallback(() => {
        console.log('[SYSTEM]: Bot stopped speaking');
        setBotIsTalking(false);
        
        // Only set timeout if we haven't already set one
        if (!responseTimeoutRef.current) {
          console.log('[SYSTEM]: Setting response timeout...');
          responseTimeoutRef.current = setTimeout(() => {
            console.log('[SYSTEM]: Response timeout reached');
            // Check if enough time has passed since last speak
            const timeSinceLastSpeak = Date.now() - lastSpeakTimeRef.current;
            if (timeSinceLastSpeak >= RESPONSE_TIMEOUT && botStatus === "connected") {
              console.log('[SYSTEM]: No response received within timeout, retrying...');
              // Trigger the LLM to continue the conversation

              const actions = voiceClient.describeActions();
              console.log(actions);

              // voiceClient.send({
              //   type: RTVIEvent.LLMContinue,
              //   data: { force: true },
              // });
            }
          }, RESPONSE_TIMEOUT);
        }
      }, [botStatus, voiceClient])
    );

    // Cleanup and timeout management
    useEffect(() => {
      // Clear timeout when component unmounts or bot disconnects
      return () => {
        setHasStarted(false);
        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
          responseTimeoutRef.current = undefined;
        }
        printHistory(); // Print history on cleanup
      };
    }, [printHistory]);

    // Reset timeout when bot status changes
    useEffect(() => {
      if (botStatus !== "connected" && responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
        responseTimeoutRef.current = undefined;
      }
    }, [botStatus]);

    const cx = clsx(
      styles.agentWindow,
      hasStarted && styles.ready,
      botIsTalking && styles.talking
    );

    return (
      <div className={styles.agent}>
        <div className={cx}>
          <ModelBadge />
          {!hasStarted ? (
            <span className={styles.loader}>
              <Loader2 size={32} className="animate-spin" />
            </span>
          ) : (
            <VoiceVisualizer participantType="bot" barColor="#FFFFFF" />
          )}
        </div>
      </div>
    );
  },
  (p, n) => p.isReady === n.isReady
);
Agent.displayName = "Agent";

export default Agent;
