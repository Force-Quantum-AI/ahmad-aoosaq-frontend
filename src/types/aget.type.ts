export interface AgentLanguage {
  id: number;
  business: number;
  agent: number;
  language: string;
  is_greeting: boolean;
  is_default: boolean;
}

export interface Agent {
  id: number;
  voice: string | null;
  language: AgentLanguage[];
  greeting_message: string | null;
  multilingual_enabled: boolean;
}

export interface AgentVoiceResponse {
  agent: number;
  id: number;
  is_active: boolean;
  voice: Voice | null;
}

export interface Voice {
  id: number;
  created_at: string;
  description: string;
  gender: string;
  is_active: boolean;
  language: string;
  name: string;
}

export interface AgentPhoneNumber {
  id: number;
  business: number;
  agent: number;
  number: string;
  maximum_call_duration: number;
  created_at: string; // ISO date string
}

export interface FormOptionsResponse {
  services: { id: number; name: string }[];
  tags: { id: number; title: string }[];
  answer_type_choices: { value: string; label: string }[];
  when_to_ask_choices: { value: string; label: string }[];
}

export type AnswerType = "yes_no" | "number" | "multiple_choice";
export type WhenToAsk = "all_calls" | "specific_services" | "tagged_services";

export interface DisqualificationRules {
  disqualifying_value: string | null;
  message_to_caller: string | null;
}

export interface IntakeQuestion {
  id: number;
  business: number;
  question: string;
  answer_type: AnswerType;
  multiple_choice: string[];
  when_to_ask: WhenToAsk;
  specific_services: string[];
  specific_tagged: string[];
  is_required: boolean;
  is_active: boolean;
  disqualification_rules: DisqualificationRules;
}
