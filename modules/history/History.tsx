'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

import React from 'react'

const history = () => {
  return (
    <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger>Qu'est-ce que React ?</AccordionTrigger>
      <AccordionContent>
        React est une bibliothèque JavaScript pour construire des interfaces utilisateur interactives et réactives.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Qu'est-ce que Next.js ?</AccordionTrigger>
      <AccordionContent>
        Next.js est un framework basé sur React qui permet le rendu côté serveur, la génération de sites statiques et bien plus.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger>Pourquoi utiliser ShadCN ?</AccordionTrigger>
      <AccordionContent>
        ShadCN offre des composants UI prêts à l'emploi et hautement personnalisables basés sur Radix UI et Tailwind CSS.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
  )
}

export default history
