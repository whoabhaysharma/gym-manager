
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fieqpcscnreafywkyyhl.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZXFwY3NjbnJlYWZ5d2t5eWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3MTU3MjYsImV4cCI6MjA0MTI5MTcyNn0.zPBKFmVu54zSEqAL9a3Yn7TdE93nVMmJTyxBz6ZDU04"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase