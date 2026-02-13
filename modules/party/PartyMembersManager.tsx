"use client"

import { useState } from "react"
import { 
  usePartyMembersWithRoles, 
  useCanManageParty, 
  useMyPartyRole,
  usePromoteToCoHost,
  useDemoteCoHost,
  useRemovePartyMember,
  useTransferOwnership 
} from "@/hooks/useParties.hook"
import { PartyMemberInfo, PartyRole } from "@/types/party.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Crown, Shield, User, UserMinus, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface PartyMembersManagerProps {
  partyId: number | string
}

const getRoleBadge = (role: PartyRole) => {
  switch (role) {
    case 'HOST':
      return <Badge variant="default" className="bg-yellow-500"><Crown className="w-3 h-3 mr-1" />Hôte</Badge>
    case 'CO_HOST':
      return <Badge variant="secondary" className="bg-blue-500 text-white"><Shield className="w-3 h-3 mr-1" />Co-hôte</Badge>
    case 'PARTICIPANT':
      return <Badge variant="outline"><User className="w-3 h-3 mr-1" />Participant</Badge>
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

export function PartyMembersManager({ partyId }: PartyMembersManagerProps) {
  const { data: members, isLoading: membersLoading } = usePartyMembersWithRoles(partyId)
  const { data: canManage } = useCanManageParty(partyId)
  const { data: myRole } = useMyPartyRole(partyId)
  
  const promoteToCoHost = usePromoteToCoHost()
  const demoteCoHost = useDemoteCoHost()
  const removeMember = useRemovePartyMember()
  const transferOwnership = useTransferOwnership()
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    action: () => void
  }>({ open: false, title: '', description: '', action: () => {} })

  const isHost = myRole === 'HOST'
  const isCoHost = myRole === 'CO_HOST'

  const handlePromoteToCoHost = (member: PartyMemberInfo) => {
    setConfirmDialog({
      open: true,
      title: "Promouvoir en co-hôte",
      description: `Voulez-vous promouvoir ${member.userName} en co-hôte ? Il pourra gérer les courses et les scores.`,
      action: () => {
        promoteToCoHost.mutate({ partyId, userId: member.userId })
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  const handleDemoteCoHost = (member: PartyMemberInfo) => {
    setConfirmDialog({
      open: true,
      title: "Rétrograder le co-hôte",
      description: `Voulez-vous rétrograder ${member.userName} en participant ? Il ne pourra plus gérer les courses.`,
      action: () => {
        demoteCoHost.mutate({ partyId, userId: member.userId })
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  const handleRemoveMember = (member: PartyMemberInfo) => {
    setConfirmDialog({
      open: true,
      title: "Retirer le membre",
      description: `Voulez-vous retirer ${member.userName} de la partie ?`,
      action: () => {
        removeMember.mutate({ partyId, userId: member.userId })
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  const handleTransferOwnership = (member: PartyMemberInfo) => {
    setConfirmDialog({
      open: true,
      title: "Transférer la propriété",
      description: `Voulez-vous transférer la propriété de la partie à ${member.userName} ? Vous deviendrez co-hôte.`,
      action: () => {
        transferOwnership.mutate({ partyId, newHostId: member.userId })
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  if (membersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Membres de la partie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const sortedMembers = [...(members || [])].sort((a, b) => {
    const roleOrder = { HOST: 0, CO_HOST: 1, PARTICIPANT: 2 }
    return roleOrder[a.role] - roleOrder[b.role]
  })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Membres de la partie
            {canManage && (
              <Badge variant="outline" className="ml-2">
                {isHost ? "Vous êtes l'hôte" : "Vous êtes co-hôte"}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {members?.length || 0} membre{(members?.length || 0) > 1 ? 's' : ''} dans cette partie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {member.role === 'HOST' && <Crown className="w-4 h-4 text-yellow-500" />}
                    {member.role === 'CO_HOST' && <Shield className="w-4 h-4 text-blue-500" />}
                    {member.role === 'PARTICIPANT' && <User className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="font-medium">{member.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.joinedAt && `Rejoint le ${new Date(member.joinedAt).toLocaleDateString('fr-FR')}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getRoleBadge(member.role)}
                  
                  {canManage && member.role !== 'HOST' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Promote to co-host (host only, for participants) */}
                        {isHost && member.role === 'PARTICIPANT' && (
                          <DropdownMenuItem onClick={() => handlePromoteToCoHost(member)}>
                            <ArrowUpCircle className="w-4 h-4 mr-2" />
                            Promouvoir co-hôte
                          </DropdownMenuItem>
                        )}
                        
                        {/* Demote co-host (host only) */}
                        {isHost && member.role === 'CO_HOST' && (
                          <DropdownMenuItem onClick={() => handleDemoteCoHost(member)}>
                            <ArrowDownCircle className="w-4 h-4 mr-2" />
                            Rétrograder en participant
                          </DropdownMenuItem>
                        )}
                        
                        {/* Transfer ownership (host only) */}
                        {isHost && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleTransferOwnership(member)}>
                              <Crown className="w-4 h-4 mr-2" />
                              Transférer la propriété
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        {/* Remove member (host can remove anyone, co-host can only remove participants) */}
                        {(isHost || (isCoHost && member.role === 'PARTICIPANT')) && (
                          <DropdownMenuItem 
                            onClick={() => handleRemoveMember(member)}
                            className="text-destructive focus:text-destructive"
                          >
                            <UserMinus className="w-4 h-4 mr-2" />
                            Retirer de la partie
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.action}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default PartyMembersManager
