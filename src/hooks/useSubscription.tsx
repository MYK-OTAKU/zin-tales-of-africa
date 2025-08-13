import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  loading: boolean;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    loading: true,
  });

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionData({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        loading: false,
      });
      return;
    }

    try {
      setSubscriptionData(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier l'abonnement",
          variant: "destructive",
        });
        setSubscriptionData({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          loading: false,
        });
        return;
      }

      setSubscriptionData({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionData(prev => ({ ...prev, loading: false }));
    }
  };

  const createCheckout = async (planType: 'monthly' | 'annual') => {
    if (!user || !session) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour souscrire à un abonnement",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la session de paiement",
          variant: "destructive",
        });
        return;
      }

      // Ouvrir Stripe checkout dans un nouvel onglet
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du paiement",
        variant: "destructive",
      });
    }
  };

  const manageSubscription = async () => {
    if (!user || !session) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour gérer votre abonnement",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error accessing customer portal:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'accéder à la gestion de l'abonnement",
          variant: "destructive",
        });
        return;
      }

      // Ouvrir le portail client Stripe dans un nouvel onglet
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error accessing customer portal:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'accès au portail client",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  return {
    ...subscriptionData,
    checkSubscription,
    createCheckout,
    manageSubscription,
  };
};