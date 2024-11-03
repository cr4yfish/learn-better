'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server/server'

type LoginParams = {
  email: string
  password: string
}

type LoginResponse = {
  hasAuthError: boolean
  authError: string
}

export async function login({ email, password }: LoginParams): Promise<LoginResponse> {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { hasAuthError: true, authError: error.message }
  }

  redirect('/')
}

type SignUpParams = {
  username: string
  email: string
  password: string
}

type SignUpResponse = {
  hasAuthError: boolean
  authError: string
  hasProgresError: boolean
  postgresError: string
}

export async function signup({ username, email, password }: SignUpParams): Promise<SignUpResponse> {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { 
      hasAuthError: true, 
      authError: error.message, 
      hasProgresError: false, 
      postgresError: '' 
    }
  }

  // get lowest rank id -> sort by xp_threshold
  const { data: ranks, error: gettingRankError } = await supabase.from("ranks").select("*").order("xp_threshold", { ascending: true }).limit(1);

  if(gettingRankError) {
    throw gettingRankError;
  }

  const dbResult = await supabase.from("profiles").insert([
    { 
      id: user?.id,
      username: username,
      avatar: null, // this can be null
      total_xp: 0, // no xp
      rank: ranks[0].id // lowest rank
    }
  ]).select().single();

  if(dbResult.error) {
    return { 
      hasAuthError: false, 
      authError: '', 
      hasProgresError: true, 
      postgresError: dbResult.error.message 
    };
  }

  const settingsResult = await supabase.from("settings").insert([
    {
      user: user?.id,
      theme: "light",
      color: "blue",
    }
  ]).select().single();
    
  if(settingsResult.error) {
    return { 
      hasAuthError: false, 
      authError: '', 
      hasProgresError: true, 
      postgresError: settingsResult.error.message
     }
  }

  redirect('/auth/course')
}