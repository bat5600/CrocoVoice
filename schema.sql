


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."_quota_weekly_consume"("p_user_id" "uuid", "p_period_start" timestamp with time zone, "p_words" integer, "p_limit" integer) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  next_used integer;
  safe_words integer;
  safe_limit integer;
begin
  safe_words := greatest(coalesce(p_words, 0), 0);
  safe_limit := greatest(coalesce(p_limit, 0), 0);

  insert into public.quota_weekly_usage (user_id, period_start, words_used, updated_at)
  values (p_user_id, p_period_start, 0, now())
  on conflict (user_id, period_start) do nothing;

  update public.quota_weekly_usage
  set
    words_used = least(words_used + safe_words, safe_limit),
    updated_at = now()
  where user_id = p_user_id and period_start = p_period_start
  returning words_used into next_used;

  return coalesce(next_used, 0);
end;
$$;


ALTER FUNCTION "public"."_quota_weekly_consume"("p_user_id" "uuid", "p_period_start" timestamp with time zone, "p_words" integer, "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."_quota_weekly_get_or_create"("p_user_id" "uuid", "p_period_start" timestamp with time zone) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  current_used integer;
begin
  insert into public.quota_weekly_usage (user_id, period_start, words_used, updated_at)
  values (p_user_id, p_period_start, 0, now())
  on conflict (user_id, period_start) do nothing;

  select words_used
  into current_used
  from public.quota_weekly_usage
  where user_id = p_user_id and period_start = p_period_start;

  return coalesce(current_used, 0);
end;
$$;


ALTER FUNCTION "public"."_quota_weekly_get_or_create"("p_user_id" "uuid", "p_period_start" timestamp with time zone) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."dictionary" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "from_text" "text" NOT NULL,
    "to_text" "text" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."dictionary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."history" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "text" "text" NOT NULL,
    "raw_text" "text" NOT NULL,
    "language" "text" NOT NULL,
    "duration_ms" integer,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "text" "text" NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quota_weekly_usage" (
    "user_id" "uuid" NOT NULL,
    "period_start" timestamp with time zone NOT NULL,
    "words_used" integer DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."quota_weekly_usage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."snippets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "cue" "text" NOT NULL,
    "cue_norm" "text" NOT NULL,
    "template" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."snippets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stripe_events" (
    "id" "text" NOT NULL,
    "created_at" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."stripe_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."styles" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "prompt" "text" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."styles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "user_id" "uuid" NOT NULL,
    "stripe_customer_id" "text",
    "status" "text",
    "plan" "text",
    "price_id" "text",
    "current_period_end" timestamp with time zone,
    "updated_at" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_settings" (
    "id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "key" "text" NOT NULL,
    "value" "text" NOT NULL,
    "updated_at" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."user_settings" OWNER TO "postgres";


ALTER TABLE ONLY "public"."dictionary"
    ADD CONSTRAINT "dictionary_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."history"
    ADD CONSTRAINT "history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quota_weekly_usage"
    ADD CONSTRAINT "quota_weekly_usage_pkey" PRIMARY KEY ("user_id", "period_start");



ALTER TABLE ONLY "public"."snippets"
    ADD CONSTRAINT "snippets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stripe_events"
    ADD CONSTRAINT "stripe_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."styles"
    ADD CONSTRAINT "styles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_stripe_customer_id_key" UNIQUE ("stripe_customer_id");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_snippets_cue_norm" ON "public"."snippets" USING "btree" ("cue_norm");



CREATE INDEX "idx_snippets_updated_at" ON "public"."snippets" USING "btree" ("updated_at");



CREATE INDEX "idx_snippets_user_id" ON "public"."snippets" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."quota_weekly_usage"
    ADD CONSTRAINT "quota_weekly_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."snippets"
    ADD CONSTRAINT "snippets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Dictionary access" ON "public"."dictionary" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "History access" ON "public"."history" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Notes access" ON "public"."notes" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Settings access" ON "public"."user_settings" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Styles access" ON "public"."styles" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."dictionary" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quota_weekly_usage" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "quota_weekly_usage_read_own" ON "public"."quota_weekly_usage" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."snippets" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "snippets_delete_own" ON "public"."snippets" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "snippets_insert_own" ON "public"."snippets" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "snippets_select_own" ON "public"."snippets" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "snippets_update_own" ON "public"."snippets" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."styles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































REVOKE ALL ON FUNCTION "public"."_quota_weekly_consume"("p_user_id" "uuid", "p_period_start" timestamp with time zone, "p_words" integer, "p_limit" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."_quota_weekly_consume"("p_user_id" "uuid", "p_period_start" timestamp with time zone, "p_words" integer, "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."_quota_weekly_consume"("p_user_id" "uuid", "p_period_start" timestamp with time zone, "p_words" integer, "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_quota_weekly_consume"("p_user_id" "uuid", "p_period_start" timestamp with time zone, "p_words" integer, "p_limit" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."_quota_weekly_get_or_create"("p_user_id" "uuid", "p_period_start" timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."_quota_weekly_get_or_create"("p_user_id" "uuid", "p_period_start" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."_quota_weekly_get_or_create"("p_user_id" "uuid", "p_period_start" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."_quota_weekly_get_or_create"("p_user_id" "uuid", "p_period_start" timestamp with time zone) TO "service_role";


















GRANT ALL ON TABLE "public"."dictionary" TO "anon";
GRANT ALL ON TABLE "public"."dictionary" TO "authenticated";
GRANT ALL ON TABLE "public"."dictionary" TO "service_role";



GRANT ALL ON TABLE "public"."history" TO "anon";
GRANT ALL ON TABLE "public"."history" TO "authenticated";
GRANT ALL ON TABLE "public"."history" TO "service_role";



GRANT ALL ON TABLE "public"."notes" TO "anon";
GRANT ALL ON TABLE "public"."notes" TO "authenticated";
GRANT ALL ON TABLE "public"."notes" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."quota_weekly_usage" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."quota_weekly_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."quota_weekly_usage" TO "service_role";



GRANT ALL ON TABLE "public"."snippets" TO "anon";
GRANT ALL ON TABLE "public"."snippets" TO "authenticated";
GRANT ALL ON TABLE "public"."snippets" TO "service_role";



GRANT ALL ON TABLE "public"."stripe_events" TO "anon";
GRANT ALL ON TABLE "public"."stripe_events" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_events" TO "service_role";



GRANT ALL ON TABLE "public"."styles" TO "anon";
GRANT ALL ON TABLE "public"."styles" TO "authenticated";
GRANT ALL ON TABLE "public"."styles" TO "service_role";



GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."user_settings" TO "anon";
GRANT ALL ON TABLE "public"."user_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."user_settings" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































