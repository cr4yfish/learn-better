'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const username = formData.get("username") as string;

  const { data: { user }, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
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
    throw dbResult.error;
  }

  const settingsResult = await supabase.from("settings").insert([
    {
      user: user?.id,
      theme: "light",
      color: "blue",
    }
  ]).select().single();
    
  if(settingsResult.error) {
    throw settingsResult.error
  }

  revalidatePath('/', 'layout')
  redirect('/')
}