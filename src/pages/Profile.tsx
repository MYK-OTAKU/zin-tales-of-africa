import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Crown, 
  Settings, 
  CreditCard, 
  Trophy, 
  Calendar,
  Mail,
  Edit,
  Save,
  X,
  RefreshCw,
  Star
} from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { subscribed, subscription_tier, subscription_end, loading, checkSubscription, manageSubscription } = useSubscription();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    display_name: '',
    avatar_url: ''
  });
  const [userPoints, setUserPoints] = useState(0);
  const [devinetteProgress, setDevinetteProgress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Charger le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      } else if (profileData) {
        setProfile({
          display_name: profileData.display_name || '',
          avatar_url: profileData.avatar_url || ''
        });
      }

      // Charger les points
      const { data: devinetteProgressData, error: devinetteError } = await supabase
        .from('user_devinette_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (devinetteError && devinetteError.code !== 'PGRST116') {
        console.error('Error loading devinette progress:', devinetteError);
      } else if (devinetteProgressData) {
        setUserPoints(devinetteProgressData.score || 0);
        setDevinetteProgress(devinetteProgressData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    setIsLoading(false);
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil",
          variant: "destructive",
        });
        return;
      }

      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-earth flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Accès restreint</h2>
            <p className="text-muted-foreground mb-6">
              Vous devez être connecté pour accéder à votre profil.
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Mon Profil</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et votre abonnement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations Profil */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-warm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <CardTitle>Informations personnelles</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        value={user.email || ''} 
                        disabled 
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_name">Nom d'affichage</Label>
                    <Input
                      id="display_name"
                      value={profile.display_name}
                      onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Votre nom d'affichage"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={updateProfile} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Abonnement */}
              <Card className="shadow-warm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Crown className="h-5 w-5 text-primary" />
                      <CardTitle>Abonnement</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={checkSubscription}
                      disabled={loading}
                    >
                      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut</span>
                    <Badge className={
                      subscribed 
                        ? 'bg-gradient-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }>
                      {subscribed ? subscription_tier : 'Gratuit'}
                    </Badge>
                  </div>

                  {subscribed && subscription_end && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Fin d'abonnement</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(subscription_end)}</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex gap-2">
                    {subscribed ? (
                      <Button onClick={manageSubscription} className="flex-1">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Gérer l'abonnement
                      </Button>
                    ) : (
                      <Button onClick={() => window.location.href = '/premium'} className="flex-1">
                        <Crown className="h-4 w-4 mr-2" />
                        Passer à Premium
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistiques */}
              <Card className="shadow-warm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <CardTitle>Statistiques</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{userPoints}</div>
                    <p className="text-sm text-muted-foreground">Points gagnés</p>
                  </div>
                  
                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Niveau Devinettes</span>
                      <span className="text-sm font-medium">{devinetteProgress?.level || 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Devinettes résolues</span>
                      <span className="text-sm font-medium">{devinetteProgress?.completed_devinettes?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Récompenses */}
              <Card className="shadow-warm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-primary" />
                    <CardTitle>Badges Devinettes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {devinetteProgress?.badges?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {devinetteProgress.badges.map(badge => (
                        <Badge key={badge} variant="secondary">{badge}</Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">Aucun badge pour le moment</p>
                      <p className="text-xs mt-2">
                        Continuez à jouer aux devinettes pour en débloquer !
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="shadow-warm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <CardTitle>Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={signOut}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;