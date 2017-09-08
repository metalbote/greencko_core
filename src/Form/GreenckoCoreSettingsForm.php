<?php
/**
 * @file
 * Contains \Drupal\greencko_core\Form\GreenckoCoreSettingsForm.
 */
namespace Drupal\greencko_core\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides the site configuration form.
 */
class GreenckoCoreSettingsForm extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'greencko_core_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['greencko_core.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('greencko_core.settings');
    $form['example'] = array(
      '#type' => 'fieldgroup',
      '#title' => $this->t('Example'),
    );
    $form['example']['items_per_page'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Items per page'),
      '#default_value' => $config->get('items_per_page'),
      '#required' => TRUE,
      '#weight' => -20,
    );
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('greencko_core.settings')
      ->set('items_per_page', $form_state->getValue('items_per_page'))->save();
    parent::submitForm($form, $form_state);
  }
}