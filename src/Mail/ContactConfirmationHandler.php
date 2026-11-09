<?php

declare(strict_types=1);

namespace App\Mail;

use App\Dto\ContactDto;
use App\Service\HomepageDataService;
use Fagathe\CorePhp\Mailer\AbstractMailerHandler;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mime\Address;

/**
 * Accusé de réception envoyé à l'auteur d'un message du formulaire de contact,
 * avec le récapitulatif de sa demande.
 *
 * Signature : nom du profil (data/profile.json), source de vérité du site.
 * Reply-To : SUPPORT_EMAIL, pour que l'auteur puisse compléter sa demande en répondant.
 *
 * @extends AbstractMailerHandler<ContactDto>
 */
final class ContactConfirmationHandler extends AbstractMailerHandler
{
    public function __construct(
        private readonly HomepageDataService $homepageData,
        #[Autowire(param: 'core_php.email.support_email')]
        private readonly ?string $ownerEmail = null,
    ) {
    }

    protected function getTemplate(): string
    {
        return 'emails/contact_confirmation.html.twig';
    }

    protected function getSubject(object $dto): string
    {
        return 'Votre message a bien été reçu — ' . $this->getOwnerName();
    }

    protected function getRecipients(object $dto): array
    {
        return [new Address($dto->email, $dto->fullName)];
    }

    protected function getReplyTo(object $dto): ?Address
    {
        return $this->ownerEmail ? new Address($this->ownerEmail, $this->getOwnerName()) : null;
    }

    protected function getContext(object $dto): array
    {
        return ['dto' => $dto, 'ownerName' => $this->getOwnerName()];
    }

    private function getOwnerName(): string
    {
        return $this->homepageData->getProfile()?->fullName ?? 'Frédérick AGATHE';
    }
}
