<?php

declare(strict_types=1);

namespace App\Dto;

use App\Validator\Constraint\FrenchPhone;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * DTO du formulaire de contact.
 *
 * Reçoit le JSON envoyé par fetchAPI() depuis homepage.ts,
 * désérialisé par le Serializer Symfony puis validé par le Validator.
 *
 * Règles miroir de la validation client dans homepage.ts :
 *   - fullName    : requis, 2–100 caractères
 *   - email       : requis, format email valide
 *   - phone       : nullable, format téléphone français (contrainte custom)
 *   - subject     : requis, valeur de l'enum ContactSubjectEnum
 *   - link_proposition : requis si subject ∈ {job_offer, project_proposition},
 *                        ignoré sinon — validé via callback #[Assert\Callback]
 *   - message     : requis, 10–2000 caractères
 *   - consent_data_usage : doit être true (checkbox RGPD)
 */
final class ContactDto
{
    #[Assert\NotBlank(message: 'Le nom complet est requis.')]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'Le nom complet doit contenir au moins {{ limit }} caractères.',
        maxMessage: 'Le nom complet ne peut pas dépasser {{ limit }} caractères.',
    )]
    public string $fullName = '';

    #[Assert\NotBlank(message: 'L\'adresse email est requise.')]
    #[Assert\Email(message: '"{{ value }}" n\'est pas une adresse email valide.')]
    #[Assert\Length(max: 255)]
    public string $email = '';

    #[FrenchPhone]
    public ?string $phone = null;

    #[Assert\NotBlank(message: 'Veuillez sélectionner un motif de contact.')]
    public ?string $subject = null;

    /**
     * Requis uniquement si subject ∈ {job_offer, project_proposition}.
     * La contrainte conditionnelle est gérée par #[Assert\Callback] ci-dessous.
     */
    #[Assert\Url(
        message: '"{{ value }}" n\'est pas une URL valide (https://…).',
        requireTld: true,
    )]
    #[SerializedName('link_proposition')]
    #[Assert\Length(max: 2048)]
    public ?string $linkProposition = null;

    #[Assert\NotBlank(message: 'Le message est requis.')]
    #[Assert\Length(
        min: 10,
        max: 2000,
        minMessage: 'Le message doit contenir au moins {{ limit }} caractères.',
        maxMessage: 'Le message ne peut pas dépasser {{ limit }} caractères.',
    )]
    public ?string $message = '';

    /**
     * Consentement RGPD — doit être true pour soumettre le formulaire.
     */
    #[SerializedName('consent_data_usage')]
    #[Assert\IsTrue(message: 'Vous devez accepter l\'utilisation de vos données.')]
    public bool $consentDataUsage = false;

    /**
     * Validation conditionnelle de link_proposition.
     *
     * Si subject nécessite un lien (job_offer | project_proposition),
     * link_proposition devient obligatoire.
     */
    #[Assert\Callback]
    public function validateLinkProposition(
        \Symfony\Component\Validator\Context\ExecutionContextInterface $context,
    ): void {
        if ($this->subject === null) {
            return;
        }

        if (!$this->requiresLinkSubject()) {
            return;
        }

        if (empty($this->linkProposition)) {
            $context
                ->buildViolation('Le lien est requis pour ce type de demande.')
                ->atPath('linkProposition')
                ->addViolation();
        }
    }

    private function requiresLinkSubject(): bool
    {
        if ($this->subject === null) {
            return false;
        }

        return in_array($this->subject, ['job_offer', 'project_proposition'], true);
    }
}
