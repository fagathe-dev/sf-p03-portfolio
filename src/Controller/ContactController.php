<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\ContactDto;
use App\Service\Mail\ContactMailer;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class ContactController extends AbstractController
{
    public function __construct(
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator,
        private readonly ContactMailer $contactMailer,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Point d'entrée Ajax pour le formulaire de contact.
     *
     * Attend un corps JSON (envoyé par fetchAPI depuis homepage.ts) :
     * {
     *   "fullName": "…",
     *   "email": "…",
     *   "phone": "…"|null,
     *   "subject": "job_offer"|"project_proposition"|"networking"|"other_motive",
     *   "linkProposition": "https://…"|null,
     *   "message": "…",
     *   "consentDataUsage": true
     * }
     *
     * Réponses :
     *   200 { success: true,  message: "…" }
     *   422 { success: false, errors: { field: "message" } }
     *   400 { success: false, message: "…" }
     *   500 { success: false, message: "…" }
     */
    #[Route('/contact', name: 'app_home_contact', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        // ── 1. Vérification de la nature de la requête ────────────────────────
        if (!$request->getContent()) {
            return $this->json(
                ['success' => false, 'message' => 'Requête invalide.'],
                Response::HTTP_BAD_REQUEST,
            );
        }

        // ── 2. Désérialisation JSON → ContactDto ──────────────────────────────
        try {
            /** @var ContactDto $dto */
            $dto = $this->serializer->deserialize(
                $request->getContent(),
                ContactDto::class,
                'json',
            );
        } catch (NotEncodableValueException) {
            return $this->json(
                ['success' => false, 'message' => 'Données JSON malformées.'],
                Response::HTTP_BAD_REQUEST,
            );
        }

        // ── 3. Validation Symfony ─────────────────────────────────────────────
        $violations = $this->validator->validate($dto);

        if (\count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                // Convertit "linkProposition" → "link_proposition" pour matcher
                // le nom du champ HTML (et la clé attendue par FormManager côté TS)
                $field = $this->propertyToFieldName($violation->getPropertyPath());
                $errors[$field] = $violation->getMessage();
            }

            return $this->json(
                ['success' => false, 'errors' => $errors],
                Response::HTTP_UNPROCESSABLE_ENTITY, // 422
            );
        }

        // ── 4. Traitement — envoi des emails ──────────────────────────────────
        // try {
            $this->contactMailer->send($dto);
        // } catch (\Throwable $e) {
        //     // Log l'erreur sans l'exposer au client
        //     $this->logger->error(
        //         'ContactMailer error: ' . $e->getMessage(),
        //         ['exception' => $e],
        //     );

        //     return $this->json(
        //         [
        //             'success' => false,
        //             'message' => 'Une erreur est survenue lors de l\'envoi. '
        //                 . 'Veuillez réessayer ou me contacter directement.',
        //         ],
        //         Response::HTTP_INTERNAL_SERVER_ERROR,
        //     );
        // }

        return $this->json([
            'success' => true,
            'message' => 'Votre message a bien été envoyé. Je vous répondrai rapidement !',
        ]);
    }

    /**
     * Convertit un propertyPath camelCase en snake_case pour FormManager.
     * Ex : "linkProposition" → "link_proposition"
     *      "[fullName]"      → "fullName"  (le Serializer peut préfixer avec [])
     */
    private function propertyToFieldName(string $propertyPath): string
    {
        // Retire les crochets éventuels produits par le Validator
        $clean = trim($propertyPath, '[]');

        // camelCase → snake_case
        return strtolower(preg_replace('/[A-Z]/', '_$0', lcfirst($clean)) ?? $clean);
    }
}
