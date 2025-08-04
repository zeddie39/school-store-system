-- Create function to completely delete a user (profile + auth record)
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id_to_delete uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    current_user_role user_role;
BEGIN
    -- Check if the current user is an admin
    SELECT role INTO current_user_role 
    FROM public.profiles 
    WHERE id = auth.uid();
    
    IF current_user_role != 'admin' THEN
        RAISE EXCEPTION 'Only admins can delete users completely';
    END IF;
    
    -- Delete from profiles first (due to foreign key)
    DELETE FROM public.profiles WHERE id = user_id_to_delete;
    
    -- Delete from auth.users (requires admin privileges)
    DELETE FROM auth.users WHERE id = user_id_to_delete;
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to delete user: %', SQLERRM;
END;
$$;