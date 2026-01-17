-- CreateTable
CREATE TABLE "Medico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "paciente" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medico_crm_key" ON "Medico"("crm");

-- CreateIndex
CREATE INDEX "Consulta_medicoId_idx" ON "Consulta"("medicoId");

-- CreateIndex
CREATE UNIQUE INDEX "Consulta_medicoId_dataHora_key" ON "Consulta"("medicoId", "dataHora");

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Medico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
