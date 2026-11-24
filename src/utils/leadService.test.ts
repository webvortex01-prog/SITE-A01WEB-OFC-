import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { leadService } from '../services/leadService';
import { Lead } from '../types/lead';

describe('leadService', () => {
  beforeEach(() => {
    // Reset seed data
    leadService.resetToDefaultSeed();
  });

  it('retrieves default seed leads', () => {
    const leads = leadService.getLeads();
    assert.ok(leads.length >= 3, 'Should have at least 3 initial leads');
    assert.equal(leads[0].status, 'NOVO');
  });

  it('adds a new lead with status NOVO and generated ID', () => {
    const newLead = leadService.addLead({
      name: 'Carlos Ferreira',
      businessName: 'Ferreira Odontologia',
      whatsapp: '11988887777',
      segment: 'Saúde / Clínica / Estética',
      bottleneck: 'ads_no_conversion',
      bottleneckLabel: 'Anúncios sem conversão',
      need: 'combo_completo',
      needLabel: 'Ecossistema Completo',
      urgency: 'imediato',
      urgencyLabel: 'Imediato',
      budgetEstimate: 2600,
      source: 'funil_anuncio',
      diagnosticSummary: 'Gargalo: Anúncios sem conversão.',
    });

    assert.ok(newLead.id.startsWith('lead-'));
    assert.equal(newLead.status, 'NOVO');
    assert.equal(newLead.name, 'Carlos Ferreira');

    const allLeads = leadService.getLeads();
    const found = allLeads.find((l) => l.id === newLead.id);
    assert.ok(found, 'New lead should exist in storage');
  });

  it('updates lead status properly', () => {
    const leads = leadService.getLeads();
    const firstLead = leads[0];

    leadService.updateLeadStatus(firstLead.id, 'FECHADO');

    const updated = leadService.getLeads().find((l) => l.id === firstLead.id);
    assert.equal(updated?.status, 'FECHADO');
  });

  it('updates lead notes properly', () => {
    const leads = leadService.getLeads();
    const firstLead = leads[0];

    leadService.updateLeadNotes(firstLead.id, 'Reunião agendada para 15h');

    const updated = leadService.getLeads().find((l) => l.id === firstLead.id);
    assert.equal(updated?.notes, 'Reunião agendada para 15h');
  });

  it('deletes a lead properly', () => {
    const leads = leadService.getLeads();
    const toDelete = leads[0];

    leadService.deleteLead(toDelete.id);

    const remaining = leadService.getLeads();
    assert.ok(!remaining.some((l) => l.id === toDelete.id));
  });
});
