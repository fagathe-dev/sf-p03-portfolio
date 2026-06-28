<?php

declare(strict_types=1);

namespace App\Dto;

final class ProfileDto
{
    /**
     * @param SocialDto[] $socials
     */
    public function __construct(
        public readonly string $fullName,
        public readonly string $title,
        public readonly string $tagline,
        public readonly string $bio,
        public readonly string $avatar,
        public readonly string $cv,
        public readonly string $location,
        public readonly array $socials,
    ) {
    }
}
